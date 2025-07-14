export const addInteractionReward = async (req, res) => {
  try {
    const { user, tokenReward, reason } = req.body;
    // Logic phát token có thể gọi contract ngoài đây
    res.status(200).json({ message: `Rewarded ${tokenReward} tokens to ${user} for ${reason}` });
  } catch (err) {
    res.status(500).json({ error: 'Reward failed', detail: err.message });
  }
};