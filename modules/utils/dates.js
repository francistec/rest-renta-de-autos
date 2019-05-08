/**
 * Cotiza un tipo de auto en especifico
 * 
 * @param pickup Fecha de Pickup
 * @param dropoff Fecha de Dropoff
 * @param type Tipo de vehiculo
 */
module.exports.range = (startDate, endDate) => {
    let dates = [],
        currentDate = startDate,
        addDays = function (days) {
            let date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
}