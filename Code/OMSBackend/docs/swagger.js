const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mobilestore API',
            version: '1.0.0',
            description: 'API documentation for the OMS backend services.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                MessageResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['admin', 'supplier', 'client'] }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        quantity: { type: 'number' },
                        supplier_id: { type: 'string' }
                    }
                },
                CartItemInput: {
                    type: 'object',
                    required: ['product_id', 'quantity'],
                    properties: {
                        product_id: { type: 'string' },
                        quantity: { type: 'number' }
                    }
                },
                RegisterInput: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 },
                        role: { type: 'string' }
                    }
                },
                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' }
                    }
                }
            }
        },
        paths: {
            '/': {
                get: {
                    tags: ['Health'],
                    summary: 'Get API welcome message',
                    responses: {
                        200: {
                            description: 'Welcome response',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/MessageResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RegisterInput' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Registration successful'
                        },
                        400: {
                            description: 'Invalid data'
                        }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginInput' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Login successful'
                        },
                        401: {
                            description: 'Invalid credentials'
                        }
                    }
                }
            },
            '/api/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Get all users (Admin only)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Users list',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        },
                        401: { description: 'Unauthorized' },
                        403: { description: 'Forbidden' }
                    }
                }
            },
            '/api/users/{id}': {
                delete: {
                    tags: ['Users'],
                    summary: 'Delete user (Admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'User deleted' },
                        401: { description: 'Unauthorized' },
                        403: { description: 'Forbidden' }
                    }
                }
            },
            '/api/users/supplier': {
                post: {
                    tags: ['Users'],
                    summary: 'Create supplier (Admin only)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RegisterInput' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Supplier created' },
                        400: { description: 'Invalid data' }
                    }
                }
            },
            '/api/products': {
                get: {
                    tags: ['Products'],
                    summary: 'Get all products',
                    responses: {
                        200: {
                            description: 'Products list',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Product' }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Products'],
                    summary: 'Create product (Supplier/Admin only)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Product' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Product created' },
                        400: { description: 'Invalid data' },
                        403: { description: 'Forbidden' }
                    }
                }
            },
            '/api/products/{id}': {
                delete: {
                    tags: ['Products'],
                    summary: 'Delete product (Supplier/Admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'Product deleted' },
                        404: { description: 'Not found or unauthorized' }
                    }
                }
            },
            '/api/carts': {
                post: {
                    tags: ['Carts'],
                    summary: 'Create cart',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['user_id'],
                                    properties: {
                                        user_id: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Cart created' },
                        400: { description: 'Invalid data' }
                    }
                }
            },
            '/api/carts/user/{userId}': {
                get: {
                    tags: ['Carts'],
                    summary: 'Get cart for user',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'userId',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'Cart data' },
                        404: { description: 'Cart not found' }
                    }
                }
            },
            '/api/carts/{cartId}/items': {
                post: {
                    tags: ['Carts'],
                    summary: 'Add item to cart',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'cartId',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CartItemInput' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Item added' },
                        400: { description: 'Invalid data' }
                    }
                }
            },
            '/api/carts/items/{itemId}': {
                delete: {
                    tags: ['Carts'],
                    summary: 'Remove item from cart',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'itemId',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'Item removed' }
                    }
                }
            },
            '/api/carts/{cartId}/checkout': {
                post: {
                    tags: ['Carts'],
                    summary: 'Checkout cart',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'cartId',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        address: { type: 'string' },
                                        city: { type: 'string' },
                                        postalCode: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Checkout successful' },
                        400: { description: 'Checkout failed' }
                    }
                }
            },
            '/api/orders': {
                post: {
                    tags: ['Orders'],
                    summary: 'Create order',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        user_id: { type: 'string' },
                                        items: {
                                            type: 'array',
                                            items: { type: 'object' }
                                        },
                                        totalPrice: { type: 'number' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Order created' },
                        400: { description: 'Invalid data' }
                    }
                }
            },
            '/api/orders/user/{userId}': {
                get: {
                    tags: ['Orders'],
                    summary: 'Get orders by user',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'userId',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'User orders' }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
