const linkFyModel = require("../models/linkFyModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const findAll = async (req, res) => {
    try {
        const alllink = await linkFyModel.find();
        res.status(200).json(alllink)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const findById = async (req, res) => {
    try {
        const findlink = await linkFyModel.findById(req.params.id)
        res.status(200).json(findlink)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const addNew = async (req, res) =>{
    try {
        const {usuario,email,senha,podcast,genero, available, description,URL} = req.body
        const newlink = new linkFyModel({usuario,email,senha,podcast,genero, available, description, URL})
        const savedlink = await newlink.save()
        res.status(201).json({message: "your new link sucess", savedlink})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}
const update = async (req, res) =>{
try {
    const {usuario,email,senha,podcast,genero,available, description, URL} = req.body
    const updated = await linkFyModel.findByIdAndUpdate(
        req.params.id, {usuario,email,senha,podcast,genero, available, description,URL})
        res.status(200).json({message: "link atualizada e salva", updated})
    
} catch (error) {
   console.error(error)
   res.status(500).json({message:"não foi possivel atualizar a link"}) 

}
}

const deleteLink = async (req, res) =>{
    try {
        
        const authHeader = req.get("authorization")
        if (!authHeader) {
            return res.status(401).send("Atenção! Voçê esqueceu de adicionar o TOKEN!")
        }
        const token = authHeader.split(" ")[1]
    
        jwt.verify(token, SECRET, async function (err) {
            if (err) {
                return res.status(403).send("acesso não autorizado!! adicione o token correto")
            }
        const {id} = req.params
        const deleted = await linkFyModel.findByIdAndDelete(id)
        const message = `O link ${deleted.podcast} foi deletada com sucesso.`
        res.status(200).json({message})
        })
    } catch (error) {
        console.error(error)
       res.status(500).json({message:"não foi possivel deletar o link"}) 
    
    }
    }
    const login = (req, res) => {
        linkFyModel.findOne({ email: req.body.email }, function (err, cadastro) {
            console.log("todos os logins", cadastro)
            if (!cadastro) {
                return res.status(404).send(`não existe cadastro com o email ${req.body.email}!`)
            }
            const senhaValida = bcrypt.compareSync(req.body.senha, cadastro.senha)
            if (!senhaValida) {
                return res.status(403).send("erro ao digitar a senha")
            }
            const token = jwt.sign({ email: req.body.email }, SECRET)
            return res.status(200).send(token)
        
        })
    }    
    
    module.exports = {
    findAll, 
    findById,
    addNew,
    update,
    deleteLink,
    login
}