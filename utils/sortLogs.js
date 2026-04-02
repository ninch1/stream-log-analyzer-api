// function for through2 for counting logs
function sortLogsWrapper(summary, level, allowedLevels) {
  return function sortLogs(chunk, enc, callback) {
    const textType = chunk.toString().trim().split(' ')[0];

    // level filter
    const isAllowed = allowedLevels.includes(textType);
    const matchesFilter = level.length === 0 || level.includes(textType);

    if (isAllowed && matchesFilter) {
      summary[textType] = (summary[textType] || 0) + 1;
    }
    callback();
  };
}

module.exports = sortLogsWrapper;
