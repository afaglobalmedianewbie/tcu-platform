// Kerangka simulasi (Placeholder) antrian latar belakang berbasis Redis (Mewakili BullMQ/Agenda)

const addToQueue = async (jobName, data, options = {}) => {
  // 1. Pemanfaatan antrian Redis untuk penundaan (Placeholder)
  // 4. Simulasi injeksi aturan percobaan ulang otomatis (Retry strategy)
  const attempts = options.attempts || 3;
  console.log(`[REDIS_QUEUE] Job '${jobName}' berhasil dilempar ke antrian.`);
  console.log(`[REDIS_QUEUE] Konfigurasi Retry Strategy: maks ${attempts} kali percobaan.`);
  
  return { jobId: 'job-uuid-mock' };
};

const sendToDeadLetterQueue = async (jobName, data, error) => {
  // 5. Simulasi isolasi data gagal (Dead letter queue) untuk investigasi manual.
  console.log(`[REDIS_DLQ] Kritis: Job '${jobName}' dikarantina ke Dead Letter Queue.`);
  console.log(`[REDIS_DLQ] Bukti Error: ${error.message}`);
};

module.exports = {
  addToQueue,
  sendToDeadLetterQueue
};
