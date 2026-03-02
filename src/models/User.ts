import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
    },
    discordUsername: String,
    discordEmail: String,
    discordAvatar: String,
    discordDiscriminator: String,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
