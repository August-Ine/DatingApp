FROM mcr.microsoft.com/dotnet/sdk:7.0.202 AS build-env
WORKDIR /app
EXPOSE 8080

#copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

#copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

#build runtime image as sdk
FROM mcr.microsoft.com/dotnet/aspnet:7.0
#specify workdir as we are using new image
WORKDIR /app
#copy everything in build-env, contents of /app/out goes to root of our container
COPY --from=build-env /app/out .
#entrypoint to our app
ENTRYPOINT [ "dotnet", "API.dll" ]