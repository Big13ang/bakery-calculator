import { DATABASE_NAME } from '@/constants/db';
// import * as schema from '@/db/schema';
// import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import { ReactNode, Suspense } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export const SQLiteWrapper = ({ children }: { children: ReactNode }) => {
    // const expoDb = openDatabaseSync(DATABASE_NAME);
    // const db = drizzle(expoDb, { schema });

    /* 
    try {
        if (expoDb) {
            expoDb.execSync(`
                CREATE TABLE IF NOT EXISTS lists (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name TEXT NOT NULL
                );
            `);
            expoDb.execSync(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name TEXT NOT NULL,
                    list_id INTEGER NOT NULL,
                    FOREIGN KEY (list_id) REFERENCES lists(id) ON UPDATE NO ACTION ON DELETE NO ACTION
                );
            `);
            console.log('✅ SQLite schema verified');
        }
    } catch (e) {
        console.error('❌ SQLite manual schema check failed:', e);
    }
    */

    // Temporarily bypass useMigrations if it's causing syntax errors
    // const { success, error } = useMigrations(db, migrations);
    // const success = true;
    const error = null;
    const isLoading = false;

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorTitle}>Oops! Something went wrong.</Text>
                <Text style={styles.errorSub}>We had trouble setting up your database.</Text>

                {__DEV__ && error && (
                    <View style={styles.devErrorBox}>
                        <Text style={styles.devErrorText}>{(error as any).message}</Text>
                    </View>
                )}
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="small" color="#666" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <Suspense fallback={<ActivityIndicator size="large" />}>
            <SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }}
                useSuspense>
                {children}
            </SQLiteProvider>
        </Suspense>
    )
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#fff'
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8
    },
    errorSub: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    },
    loadingText: {
        marginTop: 12,
        color: '#888',
        fontSize: 14
    },
    devErrorBox: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff0f0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffc1c1'
    },
    devErrorText: {
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#c00'
    }
});