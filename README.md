# Dialogue for Peace Info Chatbot

A fully client-side AI chatbot for the [Dialogue for Peace](https://transformation.ucsd.edu/initiatives/tritons-belong/d4p/index.html) initiative at UC San Diego. It answers questions about DFP fellowships, events, and programs using only the official Dialogue for Peace sources.

## How it works

- The entire app is a single `index.html` file - no server, no API keys, no backend.
- It runs the Llama 3.2 1B model locally in the visitor's browser via [WebLLM](https://webllm.mlc.ai/) and WebGPU.
- On first visit, the model (~880 MB) downloads once and is cached by the browser; later visits load instantly.
- Responses are grounded in an embedded Dialogue for Peace knowledge base, with verified outbound links only.

## Running locally

Open `index.html` in a recent Chrome or Edge browser (WebGPU required).

## Hosting

This is a static file, so it can be hosted on any static hosting service. GitHub Pages works as-is from this repository.
