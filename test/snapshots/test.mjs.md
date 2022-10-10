# Snapshot report for `test/test.mjs`

The actual snapshot is saved in `test.mjs.snap`.

Generated by [AVA](https://avajs.dev).

## base

> Snapshot 1

    {
      components: {
        requestBodies: {
          pp: {
            content: {
              'application/json': {
                schema: {
                  properties: {
                    y: {
                      type: 'number',
                    },
                  },
                  type: 'object',
                },
              },
            },
          },
        },
      },
      openapi: '3.1.0',
      paths: {
        '/test': {
          post: {
            operationId: 'post-test',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      y: {
                        type: 'number',
                      },
                    },
                    type: 'object',
                  },
                },
              },
            },
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: {
                      properties: {
                        id: {
                          type: 'string',
                        },
                      },
                      title: 'ff',
                      type: 'object',
                    },
                  },
                },
                description: 'OK',
              },
            },
            summary: '',
          },
          servers: [
            {
              url: 'http://kk.org',
            },
          ],
        },
      },
      servers: [
        {
          url: 'http://e.org',
        },
      ],
    }

## nest

> Snapshot 1

    {
      openapi: '3.1.0',
      paths: {
        '/tt': {
          post: {
            operationId: 'post-test',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      y: {
                        type: 'number',
                      },
                    },
                    type: 'object',
                  },
                },
              },
            },
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: {
                      properties: {
                        id: {
                          type: 'string',
                        },
                      },
                      title: 'ff',
                      type: 'object',
                    },
                  },
                },
                description: 'OK',
              },
            },
            summary: '',
          },
          servers: [
            {
              url: 'http://kk.org',
            },
          ],
        },
      },
    }