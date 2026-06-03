# Use an official Node.js runtime as a parent image
FROM node:22
# Set the working directory in the container
WORKDIR /app
# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./
# Install the dependencies
RUN npm install
# Copy the rest of the application code to the working directory
COPY . .
# Expose the port that the application will run on
EXPOSE 5001
# Start the application
CMD ["npm", "start"]