# Lumia

Flujo de 4 pasos para construir una influencer de IA que pueda representar una marca, hacer crecer una audiencia y cuyo proceso de creación de contenido se pueda delegar (sin cuello de botella).

Principio clave: lo más importante no es solo el prompting, sino partir de una imagen fuente muy sólida e hiperrealista. Si la imagen base no es hiperrealista, ninguna herramienta posterior (animación, escalado, etc.) lo arregla.

## Paso 1: Generación del influencer (Base Model)

Herramientas: Gemini con Nano Banana Pro.

1. Definir el influencer. Dos vías:
   - Prompt directo describiendo cómo debe ser.
   - Método alternativo: buscar una referencia externa y transformarla.
2. Generar la imagen.
3. Dar más realismo: pasar la imagen por un Gem de Gemini configurado con los parámetros de realismo, usando [prompts/01-realismo-facial.md](prompts/01-realismo-facial.md).
4. Consistencia: técnica de tres ángulos del mismo rostro (perfiles, picados, contrapicados) para garantizar consistencia total.
5. Prompt inicial de la imagen base: [prompts/05-imagen-base.md](prompts/05-imagen-base.md).

## Paso 2: System Prompt del influencer

- Pasar la imagen base por [prompts/02-analisis-influencer.md](prompts/02-analisis-influencer.md).
- Guardar el resultado como archivo de conocimiento.
- Versión corta en Markdown: [prompts/04-analisis-markdown.md](prompts/04-analisis-markdown.md).
- Crear el asistente (Gem, Custom GPT o Proyecto) con el system prompt de [prompts/03-system-prompt-asistente.md](prompts/03-system-prompt-asistente.md) y el análisis como archivo de conocimiento. Es el motor que genera los prompts de los pasos 3 y 4.

## Paso 3: Contenido lifestyle

- Generar contenido con estética Instagram usando el asistente del paso 2.
- Organizar el contenido.
- Buscar referencias y tendencias en Pinterest.

## Paso 4: Animación y video (Veo 3.1, Kling 2.6)

- Animar el contenido siguiendo tendencias del momento, sin relleno y sin edición.
- Técnica de frame inicial y frame final.
- Prompt de ejemplo para Veo 3.1: [prompts/06-animacion-video.md](prompts/06-animacion-video.md).
- Estrategia final.

## Estructura

```
prompts/
  01-realismo-facial.md
  02-analisis-influencer.md
  03-system-prompt-asistente.md
  04-analisis-markdown.md
  05-imagen-base.md
  06-animacion-video.md
```
