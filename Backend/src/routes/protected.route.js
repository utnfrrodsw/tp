export const protectedRoute = (req, res) => {
    if (req.user) {
        return res.json({ message: `Hello ${req.user.email}` });
    }
    res.status(401).json({ error: 'No user found' });
};
