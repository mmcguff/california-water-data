module.exports = {
    swaggerDefinition: {
      openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
      info: {
        title: 'Califorina Water Data API', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'An API for getting various sources about soil mositure and tree mositure',
        contact: {
            name: 'Matthew McGuff'
        },
        servers: [
            'https://california-water-data.herokuapp.com'
        ]
      },
    },
    apis: ['app.js'],
  };