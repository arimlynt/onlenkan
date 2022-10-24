const User = require('../user/model');
const path = require('path')
const fs = require('fs')
const config = require('../../config');

module.exports =  {
    //mengubah data user
    editUser: async(req, res, next)=>{
        try {
            const { id } = req.params
            const userload = req.body


            if (req.file) {
                let tmp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;

                let target_path = path.resolve(config.rootPath, `public/uploads/foto/${filename}`)

                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)

                src.pipe(dest)
                src.on('end', async () => {

                    try {
                        const user = await User.findOne({ _id: id })
    
                        let currentImage = `${config.rootPath}/public/uploads/foto/${user.foto}`;
                        if (fs.existsSync) {
                            fs.unlinkSync(currentImage)
                        }
    
                        await User.findOneAndUpdate({
                            _id: id,
                        }, {
                            ...userload,
                            foto : filename  
                        }, {runValidators: true})
    
                        res.status(201).json({message: 'data berhasil di ubah'})
                        
                    } catch (error) {
                        res.status(500).json({message: error.message || `Internal server error!`})
                    }                   
                })
            } else {
                await User.findOneAndUpdate({
                    _id: id,
                }, {
                   ...userload             
                }, {runValidators: true})


                res.status(201).json({
                    message : 'data berhasil di ubah'
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
    }
}