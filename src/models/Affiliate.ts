import mongoose from 'mongoose';

const AffiliateSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    discordUsername: String,
    discordInvite: {
      type: String,
      required: true,
    },
    affiliateCode: {
      type: String,
      required: true,
      unique: true,
    },
    youtube: {
      url: String,
      displayName: String,
    },
    twitter: {
      url: String,
      displayName: String,
    },
    roblox: {
      username: String,
      userId: Number,
    },
    favoriteGames: [
      {
        gameId: Number,
        gameName: String,
        position: Number,
      },
    ],
    partnered: {
      type: Boolean,
      default: true,
    },
    partnerName: {
      type: String,
      default: 'Sai Café',
    },
    partnerLogoUrl: String,
    profileDescription: String,
    customBackgroundUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Affiliate ||
  mongoose.model('Affiliate', AffiliateSchema);
