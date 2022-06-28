public class BaseSingleton

{

protected BaseSingleton() { }

private static HashMap map = new HashMap();

public static BaseSingleton getInstance(String classname)

{

//First, attempt to get Singleton from HashMap

BaseSingleton singleton =

(BaseSingleton)map.get(classname);

if (singleton != null)

return singleton;

else

{

//Singleton not found

if (classname.Equals("SubClassSingleton"))

singleton = new SubClassSingleton();

else {......}

//Add singleton to HashMap so we can get it again

map.put(classname, singleton);

return singleton;

}
