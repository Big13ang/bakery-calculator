# amoo-ghanad Build Automation
 
.PHONY: help check build-android build-ios clean

# Colors
BLUE := \033[34m
NC := \033[0m

help:
	@echo "$(BLUE)Available commands:$(NC)"
	@echo "  make check          - Check if Docker and Java 17 are ready"
	@echo "  make build-android  - Direct local Android release build (APK)"
	@echo "  make build-aab      - Direct local Android app bundle (AAB for Play Store)"
	@echo "  make eas-android    - EAS local Android build (Cloud styles)"
	@echo "  make build-ios      - Direct local iOS build"
	@echo "  make clean          - Remove build artifacts and temporary files"

check:
	@echo "$(BLUE)Checking environment...$(NC)"
	@java -version 2>&1 | grep "17." || (echo "Error: Java 17 is required. Current version is wrong." && exit 1)
	@echo "$(BLUE)Environment is ready!$(NC)"

# Recommended: Direct build (Pure APK generation, no device needed)
build-android: check
	@echo "$(BLUE)Starting Direct Local Android Build (APK)...$(NC)"
	export JAVA_HOME=$$(/usr/libexec/java_home -v 17) && \
	cd android && ./gradlew assembleRelease

build-aab: check
	@echo "$(BLUE)Starting Direct Local Android App Bundle (AAB)...$(NC)"
	export JAVA_HOME=$$(/usr/libexec/java_home -v 17) && \
	cd android && ./gradlew bundleRelease

# Alias for android build
build: build-android

eas-android: check
	@echo "$(BLUE)Starting EAS Local Android Build...$(NC)"
	export JAVA_HOME=$$(/usr/libexec/java_home -v 17) && \
	eas build --platform android --local

build-ios:
	@echo "$(BLUE)Starting Direct Local iOS Build (Archive)...$(NC)"
	export JAVA_HOME=$$(/usr/libexec/java_home -v 17) && \
	cd ios && xcodebuild -scheme amoo-ghanad -configuration Release build

clean:
	@echo "$(BLUE)Cleaning up...$(NC)"
	rm -rf android/build ios/build
	rm -rf dist/
