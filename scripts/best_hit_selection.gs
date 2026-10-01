function selectBestHitPerQuery() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const inputSheet = ss.getSheetByName("BLAST");
  const outputSheetName = "Best_hits";

  const data = inputSheet.getDataRange().getValues();

  if (data.length < 2) {
    throw new Error("The input sheet does not contain enough data.");
  }

  const header = data[0];
  const rows = data.slice(1);

  const queryIndex = header.indexOf("Query_ID");
  const identityIndex = header.indexOf("% Identity");
  const evalueIndex = header.indexOf("e-value");
  const bitScoreIndex = header.indexOf("Bitscore");

  if (
    queryIndex === -1 ||
    identityIndex === -1 ||
    evalueIndex === -1
  ) {
    throw new Error(
      "Required columns were not found: Query_ID, % Identity, e-value."
    );
  }

  const bestHits = {};

  rows.forEach(row => {
    const query = row[queryIndex];

    if (!query) return;

    const identity = parseFloat(row[identityIndex]) || 0;
    const evalue = parseEvalue(row[evalueIndex]);
    const bitScore =
      bitScoreIndex !== -1
        ? parseFloat(row[bitScoreIndex]) || 0
        : 0;

    if (!bestHits[query]) {
      bestHits[query] = {
        row,
        identity,
        evalue,
        bitScore
      };
      return;
    }

    const current = bestHits[query];

    const isBetterHit =
      identity > current.identity ||
      (identity === current.identity && evalue < current.evalue) ||
      (
        identity === current.identity &&
        evalue === current.evalue &&
        bitScore > current.bitScore
      );

    if (isBetterHit) {
      bestHits[query] = {
        row,
        identity,
        evalue,
        bitScore
      };
    }
  });

  const output = [header];

  Object.values(bestHits).forEach(hit => {
    output.push(hit.row);
  });

  let outputSheet = ss.getSheetByName(outputSheetName);

  if (outputSheet) {
    outputSheet.clearContents();
  } else {
    outputSheet = ss.insertSheet(outputSheetName);
  }

  outputSheet
    .getRange(1, 1, output.length, output[0].length)
    .setValues(output);

  Logger.log("Best-hit selection completed successfully.");
}


function parseEvalue(value) {
  if (value === "" || value === null || value === undefined) {
    return Number.POSITIVE_INFINITY;
  }

  if (typeof value === "number") {
    return value;
  }

  value = value.toString().trim();

  if (value === "0" || value === "0.0") {
    return 0;
  }

  const number = Number(value);

  return isNaN(number)
    ? Number.POSITIVE_INFINITY
    : number;
}
