const axios = require('axios');
const moment = require('moment');

const tomorrow = moment().add(1, 'days').format('YYYYMMDD');
const url = `https://www.pse.pl/getcsv/-/export/csv/PL_GS/data/${tomorrow}`;

async function scrapeData() {
  const response = await axios.get(url, {
    headers: { 'Content-Type': 'text/csv; charset=ISO-8859-2' },
  });
  const data = response.data;
  const lines = data.split('\n');
  const headers = lines[0].split(';');
  const indexOfDate = headers.indexOf('Data');
  const indexOfHour = headers.indexOf('Godzina');
  const indexOfNationalDemand = headers.indexOf(
    'Krajowe zapotrzebowanie na moc [MW]'
  );
  const indexOfPeakHour = headers.indexOf('Godzina szczytu');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cells = line.split(';');

    if (cells.length >= headers.length) {
      const date = new Date(moment(cells[indexOfDate]).format('YYYY-MM-DD'));
      const hour = Number(cells[indexOfHour]);
      const nationalDemand = parseInt(
        cells[indexOfNationalDemand].slice(0, -3),
        10
      );
      let peakHour = !cells[indexOfPeakHour].startsWith('NORMALNE');

      result.push({ date, hour, nationalDemand, peakHour });
      //   if (peakHour) {
      //     result.push({ date, hour, nationalDemand, peakHour });
      //   }
    }
  }

  return result;
}

scrapeData().then((data) => {
  console.log(data);

  const peakHourOnly = data.filter((el) => el.peakHour);

  console.log({ peakHourOnly });
});
