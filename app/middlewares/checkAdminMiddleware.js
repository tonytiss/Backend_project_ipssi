

function checkAdmin(req, res, next) {
    const { role } = req.decodedToken;
    
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : admin uniquement' });
    }
    
    next();
  }
  
  module.exports = checkAdmin;
  