const Sertifikat = require('./model')
const path = require('path')
const fs = require('fs')
const config = require('../../config');
const slugify = require("slugify");


module.exports={
    index: async(req, res)=>{
        try {
            const sertif = await Sertifikat.find()
            res.status(200).json({data: sertif})
        } catch (error) {
            res.status(500).json({message: error.message || 'Internal server error!'})
        }
    },
    actionCreate: async (req, res) => {
        try {
               
            const { 
                batch,
                nama
            } = req.body

            if (req.file) {
                let tmp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                const slug = `${slugify(req.body.nama).toLowerCase()}`;
                req.slug = slug;
                let filename = `${slug}` + '.' + originaExt;

                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)

                src.pipe(dest)
                src.on('end', async () => {

                    try {
                        const sertif = await Sertifikat.create({ 
                            batch,
                            nama,
                            fileSertif : filename                   
                        })
                        res.status(200).json({data: sertif})
                        
                    } catch (error) {
                        res.status(500).json({message: error.message || `Internal server error!`})
                    }         

                })
            } else {
                const sertif = await Sertifikat.create({ 
                    batch,
                    nama                   
                })
                res.status(200).json({data: sertif})

            }

        } catch (error) {
            res.status(500).json({message: error.message || `Internal server error!`})
        }
    },
    
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params
            const { 
                batch,
                nama
            } = req.body

            
            if (req.file) {
                let tmp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                const slug = `${slugify(req.body.nama).toLowerCase()}`;
                req.slug = slug;
                let filename = `${slug}` + '.' + originaExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)

                src.pipe(dest)
                src.on('end', async () => {

                    try {
                        const sertif = await Sertifikat.findOne({ _id: id })
    
                        let currentImage = `${config.rootPath}/public/uploads/${sertif.fileSertif}`;
                        if (fs.existsSync) {
                            fs.unlinkSync(currentImage)
                        }
    
                        await Sertifikat.findOneAndUpdate({
                            _id: id,
                        }, {
                            batch,
                            nama,
                            fileSertif : filename  
                        }, {runValidators: true})
    
                        res.status(200).json({message: 'data berhasil di ubah'})
                        
                    } catch (error) {
                        res.status(500).json({message: error.message || `Internal server error!`})
                    }                   
                })
            } else {

                await Sertifikat.findOneAndUpdate({
                    _id: id,
                }, {
                    batch,
                    nama,              
                }, {runValidators: true})

                res.status(200).json({message: 'data berhasil di ubah'})

            }
            
        } catch (error) {
            res.status(500).json({message: error.message || 'Internal server error!'})
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params
            const sertif = await Sertifikat.findOneAndDelete({_id: id})
           
            if (sertif) {
                let currentImage = `${config.rootPath}/public/uploads/${sertif.fileSertif}`;
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