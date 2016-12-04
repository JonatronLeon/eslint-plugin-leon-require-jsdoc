/**
 * @fileoverview An update to the require-jsdoc that catches more function expressions and declarations.
 * @author Jonathan S. Collins Leon
 */
'use strict';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
    rules: {
        'leon-require-jsdoc': {
            meta: {
                docs: {
                    description: 'require JSDoc comments',
                    category: 'Stylistic Issues',
                    recommended: false
                },

                schema: [
                    {
                        type: 'object',
                        properties: {
                            require: {
                                type: 'object',
                                properties: {
                                    ClassDeclaration: {
                                        type: 'boolean'
                                    },
                                    MethodDefinition: {
                                        type: 'boolean'
                                    },
                                    FunctionDeclaration: {
                                        type: 'boolean'
                                    },
                                    ArrowFunctionExpression: {
                                        type: 'boolean'
                                    }
                                },
                                additionalProperties: false
                            }
                        },
                        additionalProperties: false
                    }
                ]
            },

            create(context) {
                const source = context.getSourceCode();
                const DEFAULT_OPTIONS = {
                    FunctionDeclaration: true,
                    MethodDefinition: true,
                    ClassDeclaration: true,
                    ArrowFunctionExpression: true
                };
                const options = Object.assign(DEFAULT_OPTIONS, context.options[0] && context.options[0].require || {});

                /**
                 * Report the error message
                 * @param {ASTNode} node node to report
                 * @returns {void}
                 */
                function report(node) {
                    context.report(node, 'Missing @jsdoc comment.');
                }

                /**
                 * Display Warning for validation erros
                 * @param  {Object} node  AST node where error occured
                 * @param  {String} id    Id of the node which should be displayed.
                 * @returns {undefined}    undefined
                 */
                function displayWarning(node, id) {
                    context.report(node, 'Missing @jsdoc for ' + id.name);
                }

                /**
                 * Get Comment for a particular node
                 * @param  {Node} node AST node
                 * @returns {String} extracted comment for node
                 */
                function getCommentText(node) {
                    let comment = context.getComments(node).leading[0] && context.getComments(node).leading[0].value || '';
                    comment = comment.replace(/\s/g, '');
                    return comment;
                }

                /**
                 * Check if the jsdoc comment is present for class methods
                 * @param {ASTNode} node node to examine
                 * @returns {void}
                 */
                function checkClassMethodJsDoc(node) {
                    let comment;
                    let commentNode;
                    let refNode;
                    let key;

                    if (node.parent) {
                        if (node.parent.type === 'AssignmentExpression') {
                            return true;
                        }
                        refNode = node.parent;
                        if (node.parent.type === 'VariableDeclarator') {
                            commentNode = node.parent.parent;
                            key = 'id';
                        }
                        else if (node.parent.type === 'Property') {
                            commentNode = node.parent;
                            key = 'key';
                        }
                    }

                    if (typeof commentNode === 'undefined') {
                        return true;
                    }

                    comment = getCommentText(commentNode);

                    if (!comment) {
                        displayWarning(node, refNode[key]);
                    } else if (node.parent.type === 'MethodDefinition') {
                        const jsdocComment = source.getJSDocComment(node);

                        if (!jsdocComment) {
                            report(node);
                        }
                    }
                }

                /**
                 * Check if the jsdoc comment is present or not.
                 * @param {ASTNode} node node to examine
                 * @returns {void}
                 */
                function checkJsDoc(node) {
                    const jsdocComment = source.getJSDocComment(node);
                    const comment = getCommentText(node);

                    if (!jsdocComment || !comment) {
                        report(node);
                    }
                }

                return {
                    FunctionDeclaration(node) {
                        if (options.FunctionDeclaration) {
                            checkJsDoc(node);
                        }
                    },
                    FunctionExpression(node) {
                        if (options.MethodDefinition) {
                            checkClassMethodJsDoc(node);
                        }
                    },
                    ClassDeclaration(node) {
                        if (options.ClassDeclaration) {
                            checkJsDoc(node);
                        }
                    },
                    ArrowFunctionExpression(node) {
                        if (options.ArrowFunctionExpression && node.parent.type === 'VariableDeclarator') {
                            checkJsDoc(node);
                        }
                    }
                };
            }
        }
    }
};

