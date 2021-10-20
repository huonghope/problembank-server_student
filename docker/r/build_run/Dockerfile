FROM r-base:4.0.1

COPY ./run.sh /
CMD /run.sh

ENTRYPOINT ["sh","./run.sh"]
#FROM rocker/r-base:latest

#RUN mkdir -p /01_data
#RUN mkdir -p /02_code
#RUN mkdir -p /03_output

#COPY /02_code/install_packages.R /02_code/install_packages.R
#COPY /02_code/myScript.R/02_code/myScript.R

#RUN Rscript /02_code/install_packages.R