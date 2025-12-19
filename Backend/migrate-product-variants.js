const mongoose = require('mongoose');
const ProductVariant = require('./models/ProductVariant');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/BIENTUOI_DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

async function migrateProductVariants() {
  try {
    console.log('🔄 Starting migration...\n');

    // Get all variants
    const variants = await ProductVariant.find({});
    console.log(`📊 Found ${variants.length} product variants\n`);

    let updated = 0;
    let skipped = 0;

    for (const variant of variants) {
      let needsUpdate = false;
      const updates = {};

      // Check and add missing fields
      if (variant.weight === undefined) {
        updates.weight = 1;
        needsUpdate = true;
      }

      if (variant.unit === undefined) {
        updates.unit = 'kg';
        needsUpdate = true;
      }

      if (variant.status === undefined) {
        updates.status = 'active';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ProductVariant.updateOne(
          { variant_id: variant.variant_id },
          { $set: updates }
        );
        console.log(`✅ Updated variant: ${variant.variant_id} - ${variant.name}`);
        console.log(`   Added: ${JSON.stringify(updates)}`);
        updated++;
      } else {
        console.log(`⏭️  Skipped (already complete): ${variant.variant_id} - ${variant.name}`);
        skipped++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log(`   Total variants: ${variants.length}`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log('='.repeat(60));
    console.log('\n✨ Migration completed successfully!\n');

    // Verify the results
    console.log('🔍 Verifying results...');
    const verifyVariants = await ProductVariant.find({}).limit(5);
    console.log('\nFirst 5 variants after migration:');
    verifyVariants.forEach(v => {
      console.log(`\n  ${v.variant_id} - ${v.name}:`);
      console.log(`    weight: ${v.weight}, unit: ${v.unit}, status: ${v.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  }
}

// Run migration
migrateProductVariants();
