FROM python:3

RUN pip3 install cpplint
COPY ./run.sh /
CMD /run.sh

ENTRYPOINT ["sh","./run.sh"]