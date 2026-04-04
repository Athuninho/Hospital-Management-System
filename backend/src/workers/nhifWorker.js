// Simple worker to process submitted NHIF claims and simulate approval
const db = require('../db');
const nhifService = require('../services/nhifService');

async function processClaims() {
  const res = await db.query("SELECT * FROM nhif_claims WHERE status='submitted' LIMIT 50");
  for (const c of res.rows) {
    try {
      // simulate approval
      console.log('Processing NHIF claim', c.id);
      await nhifService.finalizeClaimAsApproved(c.id);
      console.log('Approved', c.id);
    } catch (err) {
      console.error('claim process error', err.message || err);
    }
  }
}

if (require.main === module) {
  processClaims().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
}
