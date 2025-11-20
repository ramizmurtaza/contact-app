const swaggerSpec = {
    openapi: '3.0.0',
    info: { title: 'Contact App API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
    paths: {
        '/users': {
            get: {
                summary: 'List users',
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                            }
                        }
                    }
                }
            }
        },
        '/users/{id}': {
            get: {
                summary: 'Get user by id',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    '200': {
                        description: 'OK',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
                    },
                    '404': { description: 'Not Found' }
                }
            }
        }
    },
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    uuid: { type: 'string', nullable: true },
                    first_name: { type: 'string', nullable: true },
                    last_name: { type: 'string', nullable: true },
                    email: { type: 'string', nullable: true },
                    contact_code: { type: 'string', nullable: true },
                    contact_no: { type: 'string', nullable: true },
                    first_time_login: { type: 'boolean', nullable: true },
                    is_active: { type: 'boolean', nullable: true },
                    is_blocked: { type: 'boolean', nullable: true },
                    is_primum_user: { type: 'boolean', nullable: true },
                    role: { type: 'string', enum: ['admin', 'user', 'developer'], nullable: true },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' }
                }
            }
        }
    }
};

export default swaggerSpec;