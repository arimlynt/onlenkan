const Link = require('./model')

module.exports={
    index: async(req, res)=>{
        try {
            const link = await Link.find()
            res.status(200).json({data: link})
        } catch (error) {
            res.status(500).json({message: error.message || 'Internal server error!'})
        }
    },
    actionCreate: async (req, res) => {
        try {
               
            const { nama, sosmed, kontak } = req.body

            const link = await Link.create({ 
                nama,
                sosmed,
                kontak                       
            })
                
            
            res.status(200).json({data: link})

        } catch (error) {
            res.status(500).json({message: error.message || `Internal server error!`})
        }
    },
    
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params
            const { nama, sosmed, kontak } = req.body

            const link = await Link.findOne({ _id: id })

            await Link.findOneAndUpdate({_id: id}, {
                nama,
                sosmed,
                kontak
            }, {runValidators: true});


            if (link) {
                res.status(200).json({message: "data berhasil di ubah"})
            } else {
                res.status(404).json({message: "data tidak ditemukan"})
            }
            
        } catch (error) {
            res.status(500).json({message: error.message || 'Internal server error!'})
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params

            const link = await Link.findOneAndDelete({_id: id})

            if (link) {
                res.status(200).json({message: "berhasil hapus data"})
            } else {
                res.status(404).json({message: "data tidak ditemukan"})
            }

        } catch (error) {
            res.status(500).json({message: error.message || 'Internal server error!'})
        }
    }
}