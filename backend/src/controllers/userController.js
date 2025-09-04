import User from '../models/User.js';

export async function getMe(req, res) {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function updateMe(req, res) {
  try {
    const { displayName, profilePicture, bio, socialLinks } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (displayName !== undefined) {
      user.displayName = displayName;
    }
    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }
    if (bio !== undefined) {
      user.bio = bio;
    }
    if (socialLinks !== undefined) {
      user.socialLinks = socialLinks;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getPublicProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (e) {
    next(e);
  }
}
