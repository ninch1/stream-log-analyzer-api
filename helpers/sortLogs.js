// function for through2 for counting logs
function sortLogsWrapper(summary) {
  return function sortLogs(chunk, enc, callback) {
    const textType = chunk.toString().split(' ')[0];
    if (summary[textType]) summary[textType]++;
    else summary[textType] = 1;
    callback();
  };
}

module.exports = sortLogsWrapper;
