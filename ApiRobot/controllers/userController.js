const Robot = require('../models/Robot');
const User = require('../models/User');

exports.SignIn = async (req, res) => {
    // Vérifier si l'utilisateur existe déjà avec le même nom, email, numéro de robot ou numéro de téléphone
    try {
     const existingUser = await User.findOne({
         $and: [
             { email: req.body.email },
             { password: req.body.password }
         ]
     });
 
     // Si l'utilisateur existe déjà, renvoyer une erreur
     if (!existingUser) {
         return res.status(400).json({ message: "Verifier si l'email ou bien password bien saisie!" });
     }
     res.status(200).json(existingUser);
 } catch (error) { 
     res.status(400).json({ message: error.message });
 }
 };

 exports.SignUp = async (req, res) => {
   // Vérifier si l'utilisateur existe déjà avec le même  email
   try {
    const existingUser = await User.findOne({
        $or: [
            { email: req.body.email }
        ]
    });

    // Si l'utilisateur existe déjà, renvoyer une erreur
    if (existingUser) {
        return res.status(400).json({ message: "L'utilisateur existe déjà avec ces informations." });
    }

    // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
    const user = new User({
        nom : req.body.nom,
        prenom: req.body.prenom,
        password: req.body.password ,
        email: req.body.email,
        role : "Admin"
        // Ajoutez d'autres propriétés de l'utilisateur ici selon votre schéma
    });

    const newUser = await user.save();

    const robot = new Robot({
        nom_utilisateur : req.body.nom,
        prenom : req.body.prenom,
        userId: newUser._id
    })

    await robot.save();
    res.status(201).json(newUser);
} catch (error) { 
    res.status(400).json({ message: error.message });
}
};



// Récupérer tous les utilisateurs
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
};

// Récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
    // Vérifier si l'utilisateur existe déjà avec le même nom, email, numéro de robot ou numéro de téléphone
    try {
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email }
            ]
        });

        // Si l'utilisateur existe déjà, renvoyer une erreur
        if (existingUser) {
            return res.status(400).json({ message: " Email existe  " });
        }

        // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
        const user = new User({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
            // Ajoutez d'autres propriétés de l'utilisateur ici selon votre schéma
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Mettre à jour un utilisateur par son ID

exports.updateUser = async (req, res) => {
    try {
        // Recherche de l'utilisateur par ID dans la base de données
        const user = await User.findById(req.params.id);
        if (user) {
            // Vérification des champs modifiés dans la requête et mise à jour des propriétés de l'utilisateur si nécessaire
            if (req.body.nom !== undefined && req.body.nom !== user.nom) {
                // Vérification de l'unicité du nouveau nom d'utilisateur
                const existingUser = await User.findOne({ nom: req.body.nom });
                if (!existingUser) {
                    user.nom = req.body.nom;
                } else {
                    return res.status(400).json({ message: "Le nom d'utilisateur est déjà pris" });
                }
            }
            if (req.body.prenom !== undefined && req.body.prenom !== user.prenom) {
                // Vérification de l'unicité du nouveau nom d'utilisateur
                const existingUser = await User.findOne({ prenom: req.body.prenom });
                if (!existingUser) {
                    user.prenom = req.body.prenom;
                } else {
                    return res.status(400).json({ message: "Le prenom d'utilisateur est déjà pris" });
                }
            }
            if (req.body.email !== undefined && req.body.email !== user.email) {
                // Vérification de l'unicité du nouvel e-mail
                const existingUser = await User.findOne({ email: req.body.email });
                if (!existingUser) {
                    user.email = req.body.email;
                } else {
                    return res.status(400).json({ message: "L'adresse e-mail est déjà utilisée par un autre utilisateur" });
                }
            }
            if (req.body.role !== undefined) {
                // Mise à jour du rôle de l'utilisateur
                user.role = req.body.role;
            }

            // Sauvegarde des modifications de l'utilisateur dans la base de données
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            // Si aucun utilisateur correspondant à l'ID n'est trouvé, renvoyer une erreur 404
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (error) {
        // En cas d'erreur, renvoyer une erreur 400 avec un message d'erreur détaillé
        res.status(400).json({ message: error.message });
    }
};



exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Extracting the 'id' parameter from the request parameters
        console.log(id, "id of user ");

        // Checking if the 'id' parameter is provided
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }

        // Finding the user by ID
        const user = await User.findByIdAndDelete(id);

        // If user doesn't exist, return a 404 response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Sending a success response
        res.json({ message: "User deleted" });
    } catch (error) {
        // Handling errors
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

