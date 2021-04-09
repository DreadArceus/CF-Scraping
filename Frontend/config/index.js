const dev = process.env.NODE_ENV !=='production'


export const server = dev ? 'https://jsonplaceholder.typicode.com/posts?-limit=6' : 'https://jsonplaceholder.typicode.com/posts?-limit=6'