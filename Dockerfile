FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY studyquest.sln .
COPY src/StudyQuest.Core/StudyQuest.Core.csproj src/StudyQuest.Core/
COPY src/StudyQuest.Infra/StudyQuest.Infra.csproj src/StudyQuest.Infra/
COPY src/StudyQuest.Api/StudyQuest.Api.csproj src/StudyQuest.Api/
RUN dotnet restore
COPY . .
RUN dotnet publish src/StudyQuest.Api/StudyQuest.Api.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 5000
COPY --from=build /out .
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "StudyQuest.Api.dll"]
