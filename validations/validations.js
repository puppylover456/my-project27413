import { body } from 'express-validator'

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min : 5}),


]


export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min : 5}),
    body('fullName').isLength({min : 3}),
    body('avatarUrl').optional().isURL(),

]


export const postCreateValidation = [
    body('title', 'Введите заголовок статьи')
      .isString().withMessage('Заголовок должен быть строкой')
      .isLength({ min: 3 }).withMessage('Заголовок должен содержать минимум 3 символа'),
    body('text', 'Введите текст статьи')
      .isString().withMessage('Текст должен быть строкой')
      .isLength({ min: 3 }).withMessage('Текст должен содержать минимум 3 символа'),
    body('tags', 'Неверный формат тэгов')
      .optional()
      .isString().withMessage('Тэги должны быть строкой'),
    body('imageUrl', 'Неверная ссылка на изображение')
      .optional()
      .isString().withMessage('URL должен быть строкой'),
]



