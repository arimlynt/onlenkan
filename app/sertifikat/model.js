const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const slugUpdate = require('mongoose-slug-updater');
mongoose.plugin(slug);
mongoose.plugin(slugUpdate);

let sertifikatSchema = mongoose.Schema({
    batch: {
        type: Number,
        required: [true, 'Batch harus diisi'],
    },
    nama: {
        type: String,
        required: [true, 'Nama harus diisi']
    },
    slug: {
        type: String,
        slug: "nama"
    },
    fileSertif: {
        type: String
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Sertifikat', sertifikatSchema);