# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## TEAM NOTES

A few things regarding how to run this software locally, you will need API access to Anthropic's Claude Sonnet 4.6, access to our secret encryption key, and access to our database. For safety and security we will not share those with anyone else other than Dr. Inan. Because of this, our program may not run locally off of your PC. 
Running steps.
If you are running on windows just run 
1. pip install -r requirements.txt 
2. python -m uvicorn main:app --reload --loop asyncio
in your node.js command prompt. This will establish the server. Then run.
1. npm run dev
2. o +enter
And these will run the frontend. That is all you need to see our application. If you are running on Linux, then go into requirements.txt and uncomment uvloop and then run the same lines as shown before.