const cron = require('node-cron');
const {BookingService} = require('../../services');

const bookingService = new BookingService();

function scheduleCrons(){
    cron.schedule("*/30 * * * *", async () => {
        await bookingService.cancelOldBookings();
    });   
}

module.exports = {
    scheduleCrons
}
