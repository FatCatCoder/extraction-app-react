# pm2
- pm2 stop ...
- pm2 restart ...
- pm2 reload ...
- pm2 delete ...
    - instead of appName use "all" for every process or the "id" for that specific process

- pm2 [list|ls|status] - List the status of all application managed by PM2
- pm2 monit - cmd monitor tool
- pm2 plus - web dashboard monitor tool

# Nginx

### websockets dashboard log 
- goaccess /var/log/nginx/access.log -o /var/www/helloespresso/html/report.html --log-format=COMBINED --real-time-html

### check for errors, reload conf, and check status
- sudo nginx -t && systemctl reload nginx && systemctl status nginx