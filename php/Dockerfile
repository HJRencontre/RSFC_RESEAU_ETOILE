FROM php:8.1-fpm

RUN apt update \
    && apt install -y zlib1g-dev g++ git libicu-dev zip libzip-dev zip \
    && docker-php-ext-install intl opcache pdo pdo_mysql \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip

WORKDIR /var/www/symfony_docker

# Installez Composer globalement
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Installez symfony globalement
RUN curl -sS https://get.symfony.com/cli/installer | php -- --install-dir=/usr/local/bin --filename=symfony

RUN git config --global user.email "antoine.gimalac@gmail.com" \ 
    && git config --global user.name "antoine-gimalac"
