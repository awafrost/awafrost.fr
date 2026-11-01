import { NextRequest } from 'next/server';
import { cacheRobloxData, dashboardCacheHeaders, fetchRobloxJson } from '@/lib/roblox-api';

const CACHE = {
  profile: 1800,
  presence: 60,
  favorites: 1800,
  avatar: 60,
  prices: 21600,
  bundles: 86400,
  groups: 3600,
  catalog: 3600,
  thumbnails: 3600,
};

const wearableAssetTypes = new Set([
  8, 11, 12, 17, 18, 19, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45, 46, 47,
  64, 65, 66, 67, 68, 69, 70, 71, 72, 76, 77, 79,
]);
const HEADLESS_FIXED_PRICE = 31000;
const KORBLOX_FIXED_PRICE = 17000;

const FIXED_AVATAR_BUNDLES = [
  {
    id: 201,
    name: 'Headless Horseman',
    price: HEADLESS_FIXED_PRICE,
    assetIds: new Set([134082453, 134082473, 134082507, 134082533, 134082557, 131592085, 15093053680]),
  },
  {
    id: 192,
    name: 'Korblox Deathspeaker',
    price: KORBLOX_FIXED_PRICE,
    assetIds: new Set([139607570, 139607625, 139607673, 139607718, 139607770, 139610147]),
  },
];

function fixedAvatarPrice(name: string): number | null {
  const normalizedName = name.toLocaleLowerCase('en');
  if (normalizedName.includes('headless')) return HEADLESS_FIXED_PRICE;
  if (normalizedName.includes('korblox')) return KORBLOX_FIXED_PRICE;
  return null;
}

interface RobloxUser {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  created?: string;
}

interface AvatarAsset {
  id: number;
  name: string;
  assetType?: { id: number; name: string };
}

interface AvatarData {
  assets?: AvatarAsset[];
}

interface FriendRecord {
  id: number;
  name: string;
  displayName: string;
}

interface PresenceRecord {
  userId: number;
  userPresenceType: number;
  lastLocation?: string;
  rootPlaceId?: number | null;
  gameId?: string | null;
}

interface GroupRole {
  group: { id: number; name: string; memberCount: number; hasVerifiedBadge?: boolean };
  role: { name: string; rank: number };
}

interface CatalogItem {
  id: number;
  name: string;
  price?: number | null;
  lowestPrice?: number | null;
  itemType?: string;
  assetType?: number;
  creatorTargetId?: number;
  creatorName?: string;
}

interface EconomyDetails {
  AssetId: number;
  Name: string;
  AssetTypeId: number;
  PriceInRobux?: number | null;
  IsForSale?: boolean;
  IsLimited?: boolean;
  IsLimitedUnique?: boolean;
  CollectiblesItemDetails?: { CollectibleLowestResalePrice?: number | null };
}

interface BodyBundle {
  id: number;
  name: string;
  bundleType?: string;
  items?: Array<{ id: number; type?: string; assetType?: number }>;
  product?: { isForSale?: boolean; isFree?: boolean; priceInRobux?: number | null };
  collectibleItemDetail?: { lowestPrice?: number | null; saleStatus?: string };
}

async function optionalJson<T>(key: string, url: string, ttl: number, init?: RequestInit): Promise<T | null> {
  return cacheRobloxData(`optional:${key}`, ttl, async () => {
    try {
      return await fetchRobloxJson<T>(url, ttl, init);
    } catch (error) {
      console.warn(`Roblox endpoint unavailable (${key}):`, error instanceof Error ? error.message : error);
      return null;
    }
  });
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, mapper: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let index = 0; index < items.length; index += concurrency) {
    const chunk = items.slice(index, index + concurrency);
    results.push(...await Promise.all(chunk.map(mapper)));
  }
  return results;
}

function presenceLabel(type?: number): string {
  if (type === 0) return 'Hors ligne';
  if (type === 1) return 'En ligne';
  if (type === 2) return 'En jeu';
  if (type === 3) return 'Dans Studio';
  return 'Indisponible';
}

async function loadDashboard(userId: string) {
  const numericUserId = Number(userId);
  const [profile, friendsCountData, followersData, favoriteGamesResult, avatarData, groupRolesResult] = await Promise.all([
    optionalJson<RobloxUser>(`profile:${userId}`, `https://users.roblox.com/v1/users/${userId}`, CACHE.profile),
    optionalJson<{ count?: number }>(`friends-count:${userId}`, `https://friends.roblox.com/v1/users/${userId}/friends/count`, CACHE.profile),
    optionalJson<{ count?: number }>(`followers-count:${userId}`, `https://friends.roblox.com/v1/users/${userId}/followers/count`, CACHE.profile),
    optionalJson<{ data?: Array<{ id: number; name: string; rootPlace?: { id: number }; placeVisits?: number }> }>(
      `favorites:${userId}`,
      `https://games.roblox.com/v2/users/${userId}/favorite/games?accessFilter=Public&limit=25&sortOrder=Desc`,
      CACHE.favorites,
    ),
    optionalJson<AvatarData>(`avatar-data:${userId}`, `https://avatar.roblox.com/v1/users/${userId}/avatar`, CACHE.avatar),
    optionalJson<{ data?: GroupRole[] }>(`groups:${userId}`, `https://groups.roblox.com/v2/users/${userId}/groups/roles`, CACHE.groups),
  ]);

  // Roblox blocks public friend-list access for this account (403); keep the count and avoid retrying a known-failing endpoint.
  const friendRecords: FriendRecord[] = [];
  const presenceIds = [numericUserId, ...friendRecords.map((friend) => friend.id)];
  const presenceResult = await optionalJson<{ userPresences?: PresenceRecord[] }>(
    `presence:${presenceIds.join(',')}`,
    'https://presence.roblox.com/v1/presence/users',
    CACHE.presence,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userIds: presenceIds }) },
  );
  const presenceByUserId = new Map((presenceResult?.userPresences ?? []).map((presence) => [presence.userId, presence]));

  const friendThumbnailResult = friendRecords.length
    ? await optionalJson<{ data?: Array<{ targetId: number; imageUrl: string }> }>(
      `friend-thumbnails:${friendRecords.map((friend) => friend.id).join(',')}`,
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${friendRecords.map((friend) => friend.id).join(',')}&size=100x100&format=Png&isCircular=false`,
      CACHE.thumbnails,
    )
    : null;
  const friendImageById = new Map((friendThumbnailResult?.data ?? []).map((thumb) => [thumb.targetId, thumb.imageUrl]));

  const friends = friendRecords
    .map((friend) => {
      const presence = presenceByUserId.get(friend.id);
      return {
        id: friend.id,
        username: friend.name,
        displayName: friend.displayName,
        avatarUrl: friendImageById.get(friend.id) ?? null,
        presenceType: presence?.userPresenceType ?? null,
        status: presenceLabel(presence?.userPresenceType),
        lastLocation: presence?.userPresenceType === 2 ? presence.lastLocation ?? null : null,
        profileUrl: `https://www.roblox.com/users/${friend.id}/profile`,
      };
    })
    .sort((a, b) => {
      const order = (value: number | null) => value === 2 ? 0 : value === 1 ? 1 : value === 3 ? 2 : value === 0 ? 3 : 4;
      return order(a.presenceType) - order(b.presenceType) || a.username.localeCompare(b.username);
    });

  const wearableAssets = (avatarData?.assets ?? []).filter((asset) => asset.assetType && wearableAssetTypes.has(asset.assetType.id));
  const wornAssetIds = new Set(wearableAssets.map((asset) => asset.id));
  const fixedBundlesWorn = FIXED_AVATAR_BUNDLES.filter((bundle) => [...bundle.assetIds].some((assetId) => wornAssetIds.has(assetId)));
  const fixedBundleAssetIds = new Set(fixedBundlesWorn.flatMap((bundle) => [...bundle.assetIds]));
  const fixedBundleItems = fixedBundlesWorn.map((bundle) => ({
    id: bundle.id,
    name: bundle.name,
    assetType: 'Bundle de corps',
    price: bundle.price,
    forSale: true,
    url: `https://www.roblox.com/bundles/${bundle.id}`,
  }));

  const bodyAssetTypes = new Set([17, 27, 28, 29, 30, 31, 79]);
  const bodyAssets = wearableAssets.filter((asset) =>
    asset.assetType && bodyAssetTypes.has(asset.assetType.id) && !fixedBundleAssetIds.has(asset.id),
  );
  const torsoAsset = bodyAssets.find((asset) => asset.assetType?.id === 27);
  const bodyBundles = torsoAsset
    ? await optionalJson<{ data?: BodyBundle[] }>(
      `body-bundles:${torsoAsset.id}`,
      `https://catalog.roblox.com/v1/assets/${torsoAsset.id}/bundles?limit=50`,
      CACHE.bundles,
    )
    : null;
  const wornBodyIds = new Set(bodyAssets.map((asset) => asset.id));
  const bundleCandidates = (bodyBundles?.data ?? [])
    .filter((bundle) => bundle.bundleType === 'BodyParts')
    .map((bundle) => {
      const bodyItems = (bundle.items ?? []).filter((item) => item.type === 'Asset' && item.assetType !== undefined && bodyAssetTypes.has(item.assetType));
      const matchedBodyIds = bodyItems.filter((item) => wornBodyIds.has(item.id)).map((item) => item.id);
      const singleAssetNamesBundle = bodyAssets.length === 1
        && matchedBodyIds.length === 1
        && bodyAssets[0].name.toLocaleLowerCase('en').startsWith(bundle.name.toLocaleLowerCase('en'));
      return { bundle, matchedBodyIds, singleAssetNamesBundle };
    })
    .filter(({ matchedBodyIds, singleAssetNamesBundle }) =>
      matchedBodyIds.length >= Math.max(4, bodyAssets.length - 1) || singleAssetNamesBundle,
    )
    .sort((a, b) => Number(b.singleAssetNamesBundle) - Number(a.singleAssetNamesBundle)
      || b.matchedBodyIds.length - a.matchedBodyIds.length);
  const selectedBodyBundle = bundleCandidates[0] ?? null;
  const bundledBodyIds = new Set(selectedBodyBundle?.matchedBodyIds ?? []);
  const remainingAssets = wearableAssets.filter((asset) => !bundledBodyIds.has(asset.id) && !fixedBundleAssetIds.has(asset.id));

  const avatarItems = await mapWithConcurrency(remainingAssets, 4, async (asset) => {
    const details = await optionalJson<EconomyDetails>(
      `asset-price:${asset.id}`,
      `https://economy.roblox.com/v2/assets/${asset.id}/details`,
      CACHE.prices,
    );
    const resalePrice = details?.CollectiblesItemDetails?.CollectibleLowestResalePrice;
    const isCollectibleLimited = details?.IsLimited === true || details?.IsLimitedUnique === true;
    const currentPrice = isCollectibleLimited && typeof resalePrice === 'number' && resalePrice > 0
      ? resalePrice
      : details?.IsForSale && typeof details.PriceInRobux === 'number'
        ? details.PriceInRobux
        : null;
    return {
      id: asset.id,
      name: details?.Name ?? asset.name,
      assetType: asset.assetType?.name ?? 'Objet avatar',
      price: currentPrice,
      forSale: details?.IsForSale ?? false,
      url: `https://www.roblox.com/catalog/${asset.id}`,
    };
  });
  const bodyBundleItem = selectedBodyBundle ? {
    id: selectedBodyBundle.bundle.id,
    name: selectedBodyBundle.bundle.name,
    assetType: 'Bundle de corps',
    price: fixedAvatarPrice(selectedBodyBundle.bundle.name)
      ?? fixedAvatarPrice(bodyAssets.find((asset) => selectedBodyBundle.matchedBodyIds.includes(asset.id))?.name ?? '')
      ?? (selectedBodyBundle.bundle.product?.isForSale
        ? selectedBodyBundle.bundle.product.priceInRobux ?? null
        : selectedBodyBundle.bundle.collectibleItemDetail?.saleStatus === 'OnSale'
          ? selectedBodyBundle.bundle.collectibleItemDetail.lowestPrice ?? null
          : null),
    forSale: selectedBodyBundle.bundle.product?.isForSale ?? selectedBodyBundle.bundle.collectibleItemDetail?.saleStatus === 'OnSale',
    url: `https://www.roblox.com/bundles/${selectedBodyBundle.bundle.id}`,
  } : null;
  const allAvatarItems = [...avatarItems, ...fixedBundleItems, ...(bodyBundleItem ? [bodyBundleItem] : [])];
  const pricedAvatarItems = allAvatarItems.filter((item) => item.price !== null);
  const avatarTotalPrice = pricedAvatarItems.reduce((sum, item) => sum + (item.price ?? 0), 0);

  const favoriteGames = (favoriteGamesResult?.data ?? []).slice(0, 25);
  const excludedPrivatePlaceIds = new Set([1336054128, 1336053854, 1336053784, 1336054191, 1336054056, 1336054561]);
  const visibleFavoriteGames = favoriteGames
    .filter((game) => !game.rootPlace?.id || !excludedPrivatePlaceIds.has(game.rootPlace.id))
    .slice(0, 12);
  const visibleUniverseIds = visibleFavoriteGames.map((game) => game.id);
  const gameThumbnails = visibleUniverseIds.length
    ? await optionalJson<{ data?: Array<{ targetId: number; imageUrl: string }> }>(
      `game-thumbnails:${visibleUniverseIds.join(',')}`,
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${visibleUniverseIds.join(',')}&size=150x150&format=Png&isCircular=false`,
      CACHE.thumbnails,
    )
    : null;
  const gameImageById = new Map((gameThumbnails?.data ?? []).map((thumb) => [thumb.targetId, thumb.imageUrl]));

  const ownerGroups = (groupRolesResult?.data ?? [])
    .filter((entry) => entry.role?.rank === 255)
    .map((entry) => entry.group);
  const groups = await Promise.all(ownerGroups.map(async (group) => {
    const [iconResult, catalogResult] = await Promise.all([
      optionalJson<{ data?: Array<{ targetId: number; imageUrl: string }> }>(
        `group-icon:${group.id}`,
        `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${group.id}&size=150x150&format=Png&isCircular=false`,
        CACHE.thumbnails,
      ),
      optionalJson<{ data?: CatalogItem[] }>(
        `group-catalog:${group.id}`,
        `https://catalog.roblox.com/v1/search/items/details?CreatorType=2&CreatorTargetId=${group.id}&Limit=10&SortType=3`,
        CACHE.catalog,
      ),
    ]);
    const iconUrl = iconResult?.data?.[0]?.imageUrl ?? null;
    const catalogItems = (catalogResult?.data ?? []).slice(0, 10);
    const itemThumbnails = catalogItems.length
      ? await optionalJson<{ data?: Array<{ targetId: number; imageUrl: string }> }>(
        `group-item-thumbnails:${catalogItems.map((item) => item.id).join(',')}`,
        `https://thumbnails.roblox.com/v1/assets?assetIds=${catalogItems.map((item) => item.id).join(',')}&size=150x150&format=Png&isCircular=false`,
        CACHE.thumbnails,
      )
      : null;
    const itemImageById = new Map((itemThumbnails?.data ?? []).map((thumb) => [thumb.targetId, thumb.imageUrl]));
    const items = catalogItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: typeof item.price === 'number' ? item.price : null,
      itemType: item.itemType ?? (item.assetType ? `Type ${item.assetType}` : 'UGC'),
      imageUrl: itemImageById.get(item.id) ?? null,
      url: `https://www.roblox.com/catalog/${item.id}`,
    }));
    return {
      id: group.id,
      name: group.name,
      memberCount: group.memberCount,
      hasVerifiedBadge: group.hasVerifiedBadge ?? false,
      iconUrl,
      url: `https://www.roblox.com/groups/${group.id}`,
      items,
    };
  }));

  const currentPresence = presenceByUserId.get(numericUserId);
  const rolimonsMembership = await optionalJson<{ premium?: boolean }>(
    `rolimons-premium:${userId}`,
    `https://api.rolimons.com/players/v1/playerassets/${userId}`,
    CACHE.profile,
  );
  const isPremium = rolimonsMembership?.premium ?? false;

  return {
    profile: profile ? {
      id: profile.id,
      username: profile.name,
      displayName: profile.displayName,
      description: profile.description ?? '',
      created: profile.created ?? null,
      url: `https://www.roblox.com/users/${profile.id}/profile`,
    } : null,
    subscription: {
      isActive: isPremium,
      label: isPremium ? 'Roblox Plus' : 'Aucun abonnement détecté',
    },
    counts: {
      friends: friendsCountData?.count ?? null,
      followers: followersData?.count ?? null,
    },
    presence: {
      type: currentPresence?.userPresenceType ?? null,
      status: presenceLabel(currentPresence?.userPresenceType),
      lastLocation: currentPresence?.userPresenceType === 2 ? currentPresence.lastLocation ?? null : null,
    },
    avatarValue: {
      totalPrice: avatarTotalPrice,
      pricedItems: pricedAvatarItems.length,
      unpricedItems: Math.max(0, allAvatarItems.length - pricedAvatarItems.length),
      bodyBundle: bodyBundleItem?.name ?? null,
      items: allAvatarItems.sort((a, b) => (b.price ?? -1) - (a.price ?? -1)),
    },
    friends: {
      available: false,
      message: 'Roblox ne donne pas accès publiquement à la liste d’amis de ce compte.',
      items: friends,
    },
    favoriteGames: visibleFavoriteGames.map((game) => ({
      id: game.id,
      name: game.name,
      rootPlaceId: game.rootPlace?.id ?? null,
      visits: game.placeVisits ?? null,
      imageUrl: gameImageById.get(game.id) ?? null,
      url: game.rootPlace?.id ? `https://www.roblox.com/games/${game.rootPlace.id}` : `https://www.roblox.com/games/${game.id}`,
    })),
    ownerGroups: groups,
    privateServer: {
      code: '530926b7bb91d44581c31a7f390b2f69',
      url: 'https://www.roblox.com/share?code=530926b7bb91d44581c31a7f390b2f69&type=Server',
    },
    updatedAt: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId || !/^\d{1,20}$/.test(userId)) {
    return Response.json({ error: 'A valid numeric userId is required' }, { status: 400 });
  }

  try {
    const data = await cacheRobloxData(`dashboard:${userId}`, CACHE.presence, () => loadDashboard(userId));
    return Response.json(data, { headers: dashboardCacheHeaders });
  } catch (error) {
    console.error('Failed to build Roblox dashboard:', error);
    return Response.json({ error: 'Roblox dashboard is temporarily unavailable' }, { status: 502 });
  }
}
