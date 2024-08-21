Weather on Wheels
=================

# connect
```sh

    docker exec               \
        -it {container_name}  \
        psql                  \
        -U {postgres_user}    \
        -d {db_name}


    docker exec -it db psql -U postgres -d weather-on-wheels

    ################################################################################

    # list dbs
    \l

    # connect to db
    \c weather-on-wheels

    # list tables
    \dt

    ################################################################################

    # clean images
    docker rmi -f $(docker images -a -q)

    # docker exec
    docker exec -it  bikeshop sh <
```


