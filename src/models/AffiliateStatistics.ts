import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema(
  {
    ipHash: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    country: String,
    city: String,
    timestamp: {
      type: Date,
      default: Date.now,
      expires: 2592000, // 30 days TTL
    },
  },
  { _id: false }
);

const AffiliateStatisticsSchema = new mongoose.Schema(
  {
    affiliateCode: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    pageVisits: {
      type: Number,
      default: 0,
    },
    discordButtonClicks: {
      type: Number,
      default: 0,
    },
    visitors: [VisitorSchema],
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    uniqueDiscordClickVisitors: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AffiliateStatistics ||
  mongoose.model('AffiliateStatistics', AffiliateStatisticsSchema);
