const User = require('./model');
const path = require('path')
const fs = require('fs')
const config = require('../../config');

module.exports =  {
    //menampilkan data user

    index: async(req, res)=>{
        try {
            const user = await User.find()
            res.status(200).json({data: user})
        } catch (error) {
            res.status(500).json({message: error.message || 'Internal server error!'})
        }
    },

    //menambah data user 
    actionCreate : async (req, res, next)=>{
        try {
            const userload = req.body

            if(req.file){
                let tmp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;

                let target_path = path.resolve(config.rootPath, `public/uploads/foto/${filename}`)

                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)

                src.pipe(dest)
                src.on('end', async () => {

                    try {
                        const user = new User({...userload, foto: filename})
                        await user.save();
                        delete user._doc.password   
                        res.status(201).json({
                            data : user
                        })
                        
                    } catch (error) {
                        if(error && error.name === "ValidationError"){
                            return res.status(422).json({
                                message: error.message,
                                error: 1,
                                fields: error.errors
                            })
                        }
                        next(error)
                    }         

                })
            } else {
                let user = new User(userload)    
                await user.save()    
                delete user._doc.password   
                res.status(201).json({
                    data : user
                })
            }
        } catch (error) {
            if(error && error.name === "ValidationError"){
                return res.status(422).json({
                    message: error.message,
                    error: 1,
                    fields: error.errors
                })
            }
            next(error)
        }
    },

    //menghapus data user
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params
            const user = await User.findOneAndDelete({_id: id})
           
            if (user) {
                let currentImage = `${config.rootPath}/public/uploads/foto/${user.foto}`;
                if (fs.existsSync) {
                    fs.unlinkSync(currentImage)
                }
                res.status(200).json({message: "Data berhasil di hapus"})
            } else {
                res.status(404).json({message: "data tidak ditemukan"})
            }

        } catch (error) {
            res.status(500).json({message: error.message || 'Internal server error!'})
        }
    }
}