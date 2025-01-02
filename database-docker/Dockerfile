FROM ubuntu:22.04


WORKDIR /usr/share

RUN apt-get update &&  apt-get upgrade -y && apt-get install -y \
    curl default-jdk default-jre libcanberra-gtk-module libgtk-3-0 wget xvfb && \
    apt-get clean && \
    wget https://dbeaver.io/files/dbeaver-ce-latest-linux.gtk.x86_64.tar.gz  && \
    tar -zxvf dbeaver-ce-latest-linux.gtk.x86_64.tar.gz && \
    rm dbeaver-ce-latest-linux.gtk.x86_64.tar.gz


COPY General /root/.local/share/DBeaverData/workspace6/General

CMD ["/usr/share/dbeaver/dbeaver"]
