require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Tienda = require('../models/Tienda');

function generarSlug(texto) {
  return texto
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const tiendas = await Tienda.find({ slug: { $exists: false } });
  console.log(`Generando slugs para ${tiendas.length} tiendas...`);
  for (const t of tiendas) {
    let slug = generarSlug(t.nombre);
    // asegurar unicidad
    let exists = await Tienda.findOne({ slug, _id: { $ne: t._id } });
    let suffix = 1;
    while (exists) {
      slug = generarSlug(t.nombre) + '-' + suffix;
      exists = await Tienda.findOne({ slug, _id: { $ne: t._id } });
      suffix++;
    }
    t.slug = slug;
    await t.save();
    console.log(`  ${t.nombre} -> ${slug}`);
  }
  console.log('Migración completada.');
  await mongoose.disconnect();
}

migrate().catch(err => { console.error(err); process.exit(1); });
