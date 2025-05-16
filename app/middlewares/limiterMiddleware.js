

const loginAttempts = new Map()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

const loginLimiterByEmail = (req, res, next) => {
    const email = req.body.email

    if (!email) {
        return res.status(400).json({ error: "L'email est requis pour limiter les tentatives." })
    }

    const now = Date.now();
    const record = loginAttempts.get(email) || { attempts: 0, firstAttempt: now }

    if (now - record.firstAttempt > WINDOW_MS) {
        loginAttempts.set(email, { attempts: 1, firstAttempt: now })
        return next()
    }

    if (record.attempts >= MAX_ATTEMPTS) {
        const remaining = Math.ceil((WINDOW_MS - (now - record.firstAttempt)) / 1000)
        return res.status(429).json({
            error: `Trop de tentatives. Réessayez dans ${remaining} secondes.`
        })
    }

    record.attempts++
    loginAttempts.set(email, record)
    next()
} 

// 👇 On exporte le middleware ET la Map
module.exports = {
    loginLimiterByEmail,
    loginAttempts
}
