export default new Promise(async (resolve) => {
  const handleQuery = import('./queries');
  const handleMutation = import('./mutations');

  resolve({ handleQuery, handleMutation });
});
