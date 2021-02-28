export default {
  queryResolvers: () => ({}),
  mutationResolvers: ({ handleMutation, handleError, MUTATION_NAMES: {} }) => ({
    uploadImages: (rootQuery = {}, { images }, { token }) => {
      Promise.all(images).then((resolvedImages) => {
        resolvedImages.forEach(async (img) => {
          const stream = await img.createReadStream();
        });
      });

      return Promise.resolve({ success: true });
    },
  }),
};
