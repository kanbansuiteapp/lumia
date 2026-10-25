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
4. Consistencia: técnica de tres ángulos del mismo rostro para garantizar consistencia total.

## Paso 2: System Prompt del influencer

- Pasar la imagen base por [prompts/02-analisis-influencer.md](prompts/02-analisis-influencer.md).
- Guardar el resultado como archivo de conocimiento.
- Configurar el asistente de IA con ese archivo y el system prompt (según el tutorial, aquí está una de las claves).

## Paso 3: Contenido lifestyle

- Generar contenido con estética Instagram usando el asistente del paso 2.
- Organizar el contenido.
- Buscar referencias y tendencias en Pinterest.

## Paso 4: Animación y video (Veo 3.1, Kling 2.6)

- Animar el contenido siguiendo tendencias del momento, sin relleno y sin edición.
- Técnica de frame inicial y frame final.
- Estrategia final.

## Pendiente

El texto recibido se corta en el Paso 1 (cuando menciona el Gem de realismo). Faltan los detalles de la técnica de tres ángulos, el system prompt, Pinterest y la animación.

## Estructura

```
prompts/
  01-realismo-facial.md
  02-analisis-influencer.md
```
