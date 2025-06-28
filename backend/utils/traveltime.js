function calcTravelTime(rooms) {
  let minF = rooms[0].floor, maxF = rooms[0].floor;
  let minP = rooms[0].position, maxP = rooms[0].position;

  for (const r of rooms) {
    if (r.floor < minF) minF = r.floor;
    if (r.floor > maxF) maxF = r.floor;
    if (r.position < minP) minP = r.position;
    if (r.position > maxP) maxP = r.position;
  }
  return (maxF - minF) * 2 + (maxP - minP);
}

module.exports = { calcTravelTime };