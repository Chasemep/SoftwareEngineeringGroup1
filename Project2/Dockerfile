# Use the official Nginx image as a lightweight base
FROM nginx:alpine

# Copy the static HTML file to the default Nginx public directory
COPY index.html /usr/share/nginx/html/index.html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
