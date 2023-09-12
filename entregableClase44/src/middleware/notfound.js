export const notFoundMiddleware = (req, res) => {
    res.status(404).render('notFound');
};

