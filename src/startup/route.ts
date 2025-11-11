import express from 'express';
import user from "../routes/user.route"
import content from "../routes/content.route"
import link from "../routes/link.route"
import login from "../routes/auth.route"
import { Application } from 'express';

export default function(app: Application){
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/user', user)
    app.use('/content', content)
    app.use('/link', link)
    app.use('/login', login)
}